import { TestBed } from '@angular/core/testing';
import { Icon } from './icon';
import { SVG_ICONS } from './icons.constants';
import { By } from '@angular/platform-browser';

describe('Icon', () => {
  it('should render an SVG with the correct path for the given icon name', () => {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();
    const pathDebugEl = fixture.debugElement.query(By.css('svg path'));
    expect(pathDebugEl).toBeTruthy();
    const svgPath: SVGPathElement = pathDebugEl.nativeElement;
    expect(svgPath.getAttribute('d')).toBe(SVG_ICONS['check']);
  });

  it('should render different paths for different icon names', () => {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'menu');
    fixture.detectChanges();
    const debugMenuDebugEl: SVGPathElement = fixture.debugElement.query(By.css('svg path')).nativeElement;
    expect(debugMenuDebugEl.getAttribute('d')).toBe(SVG_ICONS['menu']);
    fixture.componentRef.setInput('name', 'close');
    fixture.detectChanges();
    const debugCloseDebugEl: SVGPathElement = fixture.debugElement.query(By.css('svg path')).nativeElement;
    expect(debugCloseDebugEl.getAttribute('d')).toBe(SVG_ICONS['close']);
  });

  it('should render an SVG element', () => {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'sun');
    fixture.detectChanges();
    const svg = fixture.debugElement.query(By.css('svg'));
    expect(svg).toBeTruthy();
    expect((svg.nativeElement as SVGElement).getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('should include select-none class on SVG', () => {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'moon');
    fixture.detectChanges();
    const svg: SVGPathElement = fixture.debugElement.query(By.css('svg')).nativeElement;
    expect(svg.classList.contains('select-none')).toBe(true);
  });
});
