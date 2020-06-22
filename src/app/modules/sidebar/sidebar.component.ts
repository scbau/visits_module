import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { Hero } from '../../models/data';
import { List } from '../../models/list';
// import { HeroService } from '../../services/data/data.services';

import { MessageService } from '../../services/message/message.service';

interface FoodNode {
    id: number,
    name: string,
    children?: FoodNode[],
    route?: string,
    selected?: boolean,
    subname?: string
}

var TREE_DATA: FoodNode[] = [
  {
    "id": 1,
    "name": "Scorecard",
    "route": "/dashboard"
  },
  {
    "id": 2,
    "name": "Not Visited",
    "route": "/dashboard/not-visited"
  },
  {
    "id": 3,
    "name": "Checksheet Compliance",
    "route": "/dashboard/checksheet",
    "children": [
      {
        "id": 31,
        "name": "Forklift Pre-start Checksheet",
        "route": "/dashboard/checksheet/forklift"
      },
      {
        "id": 32,
        "name": "VSR Pre-start Checksheet",
        "route": "/dashboard/checksheet/vsr",
        /*"children": [
          {
            "id": 321,
            "name": "Daily",
            "route": "/dashboard/checksheet/vsr/daily",
          },
          {
            "id": 322,
            "name": "Monthly",
            "route": "/dashboard/checksheet/vsr/monthly",
          },
          {
            "id": 323,
            "name": "Maintenance",
            "route": "/dashboard/checksheet/vsr/maintenance",
          }
        ]*/
      }, 
      {
        "id": 33,
        "name": "Warehouse Depot Checksheet",
        "route": "/dashboard/checksheet/warehouse",
        /*"children": [
          {
            "id": 331,
            "name": "Daily",
            "route": "/dashboard/checksheet/warehouse/daily",
          },
          {
            "id": 332,
            "name": "Weekly",
            "route": "/dashboard/checksheet/warehouse/weekly",
          },
          {
            "id": 333,
            "name": "Monthly",
            "route": "/dashboard/checksheet/warehouse/monthly",
          },
          {
            "id": 334,
            "name": "Bi-Annual/Annual",
            "route": "/dashboard/checksheet/warehouse/biannual",
          }
        ]*/
      }
    ]
  }
];

@Component({
    selector: 'app-sidebar',
    providers: [MessageService],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit, OnDestroy {

    treeControl = new NestedTreeControl<FoodNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<FoodNode>();

    heroes: Hero[];
    panelOpenState = true;
    navbarText: string = "";
    mobileQuery: MediaQueryList;
    router: Router;

    data;
    message;

    constructor(
        private _router: Router,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        changeDetectorRef: ChangeDetectorRef, 
        media: MediaMatcher, 
        iconRegistry: MatIconRegistry, 
        sanitizer: DomSanitizer) {

        this.router = _router;

        this.dataSource.data = TREE_DATA;

        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);

        iconRegistry.addSvgIcon(
            'menu',
            sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/menu.svg'));

    }

    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
    private _mobileQueryListener: () => void;

    ngOnInit() {
        // this.getHeroes();
        this.messageService.currentMessage.subscribe(message => { this.navbarText = message; console.log(message); });

        this.navbarText = this.data.title || "";
    }

    /*getList(): void {
        console.log('test');
        this.heroService.getList()
            .subscribe(list => this.fillerNav = list);
    }*/

    /*getHeroes(): void {
        this.heroService.getHeroes()
            .subscribe(heroes => this.heroes = heroes);
    }*/

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    changeRoute(node: FoodNode): void {
        this.navbarText = node.name;

        this.router.navigateByUrl(node.route);
    }

    openSettings(): void {
      this.navbarText = "Settings";
      this.router.navigateByUrl('dashboard/settings');
    }

    public setTitle(text: string): void {
        this.navbarText = text;
    }
}
