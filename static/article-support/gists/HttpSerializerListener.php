<?php 
 
namespace Genero\ProjectBundle\EventListener;
 
// Framework Internals
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;
 
// Specific
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SerializerBundle\Serializer\Serializer;
 
// Exceptions
use \Exception;
 
/**
 * Read for API requests, hijacks response to reply in the format the API requested for
 * 
 * @DI\Service
 * 
 * This listener can be used if you want to expose some Doctrine2 
 * Entities using the JMSSerializerBundle to give basic list output. 
 * I would recommend that some other service would format and add other 
 * meta data from the controller.
 * 
 * This can be seen as a quick way to convert an entity list into a xml/json 
 * representation. Without using templating engine!
 * 
 * 
 * WARNING
 * =======
 * If you are interested into HATEOAS and the Hypermedia (aka. the "real" 
 * implementation of "REST"). 
 * 
 * This helper is NOT sufficient :/  
 * 
 * It would be better that an other project reads and formats the given 
 * serialized entities creating a proxy application using both Tonic and Guzzle,
 * to expose a simplified REST interface and where this current gist is a way to 
 * convert database entries  into data that can be passed along that proxy.
 * Read HTTP requests, and grabs HTTP_ACCEPT header and 
 * if it matches desired header (currently supported with json)
 * it will superseed the @Template and it's underlining 
 * templating engine configuration and use instead the Serializer
 * to return the controller's data as serialized
 * 
 * @author Renoir Boulanger <hello@renoirboulanger.com>
 */
class HttpSerializerListener
{
 
    /* @var JMS\SerializerBundle\Serializer\Serializer */
    protected $serializer;
 
    /**
     * @DI\InjectParams({
     *     "serializer"      = @DI\Inject("serializer")
     * })
     *
     * @param \JMS\SerializerBundle\Serializer\Serializer $serializer
     **/
    public function __construct(Serializer $serializer)
    {
        $this->serializer = $serializer;
    }
 
    protected function serialize($content)
    {
        try {
            // TODO, support also XML
            $serialized = $this->serializer->serialize($content, 'json');
        } catch(Exception $e){
            throw new Exception('Had problems with serializing entity',0,$e);
        }
 
        return $serialized;
    }
    
    protected function jsonResponse($content)
    {
        if(!is_array($content)){
            throw new Exception('Please send an array to '.__METHOD__);
        }
 
        $response = new Response(json_encode($content));
        //$response->setETag(md5($serialized));
        $response->setPublic(); // make sure the response is public/cacheable
        // TODO, support also XML
        $response->headers->set('Content-Type', 'application/json');
 
        return $response;
    }    
 
    /**
     * @DI\Observe("kernel.controller", priority="-1")
     *
     * Determines and sets the Request format
     *
     * See: https://github.com/FriendsOfSymfony/FOSRestBundle/blob/master/EventListener/FormatListener.php#L64
     * 
     * @param FilterControllerEvent $event The event
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        $request = $event->getRequest();
        // TODO, support also XML
        $is_json = (strstr($request->server->get('HTTP_ACCEPT'),'json'))?true:false;
 
        if($is_json === true && $event->getRequestType() === HttpKernelInterface::MASTER_REQUEST) {
            // TODO, support also XML
            $request->setRequestFormat('json');
            $request->attributes->set('_format', 'json');
        }
    }
 
 
    /**
     * @DI\Observe("kernel.view", priority="-10")
     * 
     * Renders JSON output if it has been requested
     *
     * See 
     *     \Sensio\Bundle\FrameworkExtraBundle\EventListener\TemplateListener
     * and
     *     http://symfony.com/doc/master/components/http_kernel/introduction.html#the-kernel-view-event
     *     https://github.com/FriendsOfSymfony/FOSRestBundle/blob/master/EventListener/ViewResponseListener.php
     *     
     * @param GetResponseForControllerResultEvent $event A GetResponseForControllerResultEvent instance
     */
    public function onKernelView(GetResponseForControllerResultEvent $event)
    {
        $request = $event->getRequest();
        $parameters = $event->getControllerResult();
        var_dump($request->attributes->get('_template'));die();
 
        // TODO, support also XML
        if ($request->attributes->get('_format') === 'json') {
            foreach($parameters as $param) {
                // Escaping problem, making it an array
                // Instead of this; use the EntityManager and detach the entity #FIXME
                $serialized[] = json_decode($this->serialize($param),1);  
            }
            $response = $this->jsonResponse($serialized);
            $event->setResponse($response);
            $event->stopPropagation();
 
            $template = $request->attributes->get('_template');
            $template->set('_template', null);
            $view->setTemplate($template);
        }
 
    }
}