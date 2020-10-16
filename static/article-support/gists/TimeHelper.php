<?php

namespace Renoirb\UserRequest\Util;

// Specific
use \DateTime;
use \DateInterval;

/**
 * Time helper utility
 *
 * Takes care of calculating time ranges, intervals.
 *
 * @author Renoir Boulanger <hello@renoirboulanger.com>
 **/
class TimeHelper
{
    /**
     * Calculate an Interval
     *
     * Return difference between [now] and [then] as an Interval (object)
     *
     * @return DateInterval $interval
     */
    public function calculateInterval(DateTime $then)
    {
        $now = new DateTime();
        return $now->diff($then);
    }

    /**
     * Difference in days since $then
     *
     * @return int days
     */
    public function differenceDays(DateTime $then)
    {
        //                                                 secs,   minutes,  hours
        return round((($this->differenceSeconds($then)  /  60)  /  60)   /   24,     0, PHP_ROUND_HALF_UP);
    }

    /**
     * Difference in minutes since $then
     *
     * @return int minutes
     */
    public function differenceMinutes(DateTime $then)
    {
        //                                               secs
        return round($this->differenceSeconds($then)  /  60,      0, PHP_ROUND_HALF_UP);
    }

    /**
     * Difference in minutes since...?
     *
     * Source: http://www.php.net/manual/en/dateinterval.format.php, comment by: kuzb on 04-Feb-2011 05:15
     *
     * @return int minutes
     */
    public function differenceSeconds(DateTime $then)
    {
        $interval = $this->calculateInterval($then);

        $seconds = ($interval->y * 365 * 24 * 60 * 60) +
           ($interval->m * 30 * 24 * 60 * 60) +
           ($interval->d * 24 * 60 * 60) +
           ($interval->h * 60 *60) +
           $interval->s;

        return $seconds;
    }

    public function toSeconds(DateInterval $interval)
    {
        return ($interval->y * 365 * 24 * 60 * 60) +
           ($interval->m * 30 * 24 * 60 * 60) +
           ($interval->d * 24 * 60 * 60) +
           ($interval->h * 60 *60) +
           ($interval->i * 60) +
           $interval->s;
    }
}