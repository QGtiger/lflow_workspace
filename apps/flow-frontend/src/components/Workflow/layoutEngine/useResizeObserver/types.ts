import type { MutableRefObject } from 'react';

export type TargetValue<T = Element> = T | undefined | null;

export type TargetType = HTMLElement | Element | Window | Document;

export type BasicTarget<T extends TargetType = Element> = (() => T) | MutableRefObject<TargetValue<T>>;
