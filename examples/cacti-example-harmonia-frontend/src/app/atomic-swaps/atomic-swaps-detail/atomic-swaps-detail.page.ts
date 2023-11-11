import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";

import { Logger, LoggerProvider } from "@hyperledger/cactus-common";

@Component({
  selector: "app-atomic-swaps-detail",
  templateUrl: "./atomic-swaps-detail.page.html",
  styleUrls: [],
})
export class AtomicSwapsDetailPage implements OnInit {
  private readonly log: Logger;
  public form: UntypedFormGroup;
  @Input()
  public bookshelfIds: string[];

  constructor() {
    this.log = LoggerProvider.getOrCreate({ label: "AtomicSwapsDetailPage" });
  }

  async ngOnInit(): Promise<void> {
    this.log.debug("ngOnInit()");
  }

  onClickFormSubmit(): void {
    this.log.debug("form submitted");
  }

  onClickBtnCancel(): void {
    this.log.debug("form submission cancelled by user");
  }
}
