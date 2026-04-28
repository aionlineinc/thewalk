export type DomainEvent<TType extends string = string, TPayload = unknown> = {
  type: TType;
  at: Date;
  payload: TPayload;
};

export interface EventBus {
  publish(event: DomainEvent): Promise<void> | void;
}

export class NoopEventBus implements EventBus {
  publish(): void {
    // intentional noop
  }
}

