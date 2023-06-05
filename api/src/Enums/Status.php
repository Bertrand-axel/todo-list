<?php

namespace App\Enums;

enum Status: string
{
    case WAITING = 'WAITING';
    case DOING = 'DOING';
    case DONE = 'DONE';

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
