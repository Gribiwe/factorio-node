import {ChangeDetectorRef, Component} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Angular';
  mobileQuery: MediaQueryList;

  fillerNav = [
    {text: "production", route: "/production"},
    {text: "technologies", route: "/technologies"}
  ];

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  changeLanguage(code: string) {
    this.translate.use(code);
  }
}
