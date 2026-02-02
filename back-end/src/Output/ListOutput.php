<?php

namespace App\Output;

class ListOutput
{
    /** @var array<object> */
    public array $items = [];

    public int $count;

    public function __construct(iterable $entities, string $outputClass)
    {
        foreach ($entities as $entity) {
            $this->items[] = new $outputClass($entity);
        }

        $this->count = count($this->items);
    }
}
