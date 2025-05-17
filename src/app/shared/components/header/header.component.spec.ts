import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    routerEvents$ = new Subject<any>();

    const mockRouter = {
      events: routerEvents$.asObservable(),
      navigate: jasmine.createSpy('navigate'),
    };
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isEnableItemHome based on NavigationEnd event', () => {
    routerEvents$.next(new NavigationEnd(1, '/home', '/home'));
    expect(component.isEnableItemHome).toBeFalse();

    routerEvents$.next(new NavigationEnd(1, '/other-route', '/other-route'));
    expect(component.isEnableItemHome).toBeTrue();
  });

  it('should return the correct icon from getIcon()', () => {
    component.isEnableItemHome = true;
    expect(component.getIcon()).toBe('arrow_back');

    component.isEnableItemHome = false;
    expect(component.getIcon()).toBe('help_outline');
  });

  it('should navigate to the specified route in goTo()', () => {
    const route = '/test-route';
    component.goTo(route);
    expect(router.navigate).toHaveBeenCalledWith([route]);
  });

  it('should call history.back() in back() if isEnableItemHome is true', () => {
    spyOn(history, 'back');
    component.isEnableItemHome = true;

    component.back();
    expect(history.back).toHaveBeenCalled();
  });

  it('should not call history.back() in back() if isEnableItemHome is false', () => {
    spyOn(history, 'back');
    component.isEnableItemHome = false;

    component.back();
    expect(history.back).not.toHaveBeenCalled();
  });
});
