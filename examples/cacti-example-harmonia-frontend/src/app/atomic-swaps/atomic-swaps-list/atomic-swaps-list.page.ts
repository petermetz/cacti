import { Component, OnInit } from "@angular/core";

import { Logger, LoggerProvider } from "@hyperledger/cactus-common";
import { ApiService } from "src/app/api-service";

@Component({
  selector: "app-atomic-swaps-list",
  templateUrl: "./atomic-swaps-list.page.html",
  styleUrls: [],
})
export class AtomicSwapsListPage implements OnInit {
  private readonly log: Logger;

  public lastResponse: unknown;

  constructor(private api: ApiService) {
    this.log = LoggerProvider.getOrCreate({ label: "AtomicSwapsListPage" });
    this.log.info("Constructor finished running OK");
  }

  async ngOnInit(): Promise<void> {
    this.log.info("ngOnInit()");
  }

  async clickStep1(): Promise<void> {
    this.log.info("clickStep1()");
    const res1 = await this.api.doStep1();
    this.lastResponse = res1.data;
    this.log.info("Step 1: ", res1);
  }

  async clickStep2(): Promise<void> {
    this.log.info("clickStep2()");
    const res1 = await this.api.doStep2();
    this.lastResponse = res1.data;
    this.log.info("Step 2: ", res1);
  }

  async clickStep3(): Promise<void> {
    this.log.info("clickStep3()");
    const res1 = await this.api.doStep3();
    this.lastResponse = res1.data;
    this.log.info("Step 3: ", res1);
  }

  async clickStep4(): Promise<void> {
    this.log.info("clickStep4()");
    const res1 = await this.api.doStep4();
    this.lastResponse = res1.data;
    this.log.info("Step 4: ", res1);
  }

  async clickStep5(): Promise<void> {
    this.log.info("clickStep5()");
    const res1 = await this.api.doStep5();
    this.lastResponse = res1.data;
    this.log.info("Step 5: ", res1);
  }

  async clickAddNew(): Promise<void> {
    this.log.info(`clickAddNew()`);
  }
}
