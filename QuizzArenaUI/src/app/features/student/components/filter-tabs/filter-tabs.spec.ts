import { TestBed } from '@angular/core/testing';
import { FilterTabs } from './filter-tabs';

describe('FilterTabs', () => {
  const options = [
    {
      label: 'Pending',
      value: 'Pending',
    },
    {
      label: 'Active',
      value: 'Active',
    },
  ];

  it('should render all options', () => {
    const fixture = TestBed.createComponent(FilterTabs);

    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('value', 'Pending');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Pending');
    expect(buttons[1].textContent).toContain('Active');
  });

  it('should highlight selected option', () => {
    const fixture = TestBed.createComponent(FilterTabs);

    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('value', 'Active');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons[0].classList.contains('bg-white')).toBeFalsy();
    expect(buttons[1].classList.contains('bg-white')).toBeTruthy();
  });

  it('should emit valueChange when an option is clicked', () => {
    const fixture = TestBed.createComponent(FilterTabs);

    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('value', 'Pending');

    const emitSpy = vi.spyOn(fixture.componentInstance.valueChange, 'emit');

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();

    expect(emitSpy).toHaveBeenCalledWith('Active');
  });
});
