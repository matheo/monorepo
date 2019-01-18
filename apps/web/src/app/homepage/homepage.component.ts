import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'web-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  @HostBinding('class') cssClass = 'web-page-cover';

  constructor() {}

  ngOnInit() {}
}
