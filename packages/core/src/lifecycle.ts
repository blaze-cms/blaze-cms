import type { LifecycleHooks } from "@blaze-cms/types";

export type LifecycleState = "init" | "ready" | "shutdown" | "error";

export class Lifecycle {
  private state: LifecycleState = "init";
  private readonly hooks: LifecycleHooks;

  constructor(hooks?: LifecycleHooks) {
    this.hooks = hooks ?? {};
  }

  getState(): LifecycleState {
    return this.state;
  }

  async init(): Promise<void> {
    if (this.state !== "init") {
      throw new Error(`Cannot init from state: ${this.state}`);
    }
    await this.hooks.onInit?.();
    this.state = "ready";
  }

  async ready(): Promise<void> {
    await this.hooks.onReady?.();
  }

  async shutdown(): Promise<void> {
    if (this.state !== "ready") {
      throw new Error(`Cannot shutdown from state: ${this.state}`);
    }
    await this.hooks.onShutdown?.();
    this.state = "shutdown";
  }

  async onError(): Promise<void> {
    this.state = "error";
  }
}
