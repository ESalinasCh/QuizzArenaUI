import { TestBed } from '@angular/core/testing';
import { FeatureCard } from './feature-card';

describe('FeatureCard', () => {
  const defaultInputs = {
    imageSrc: 'assets/ai-icon.svg',
    imageAlt: 'AI icon',
    title: 'AI Processes',
    description: 'AI-powered quiz generation',
  };

  it('should render title and description', () => {
    const fixture = TestBed.createComponent(FeatureCard);
    fixture.componentRef.setInput('imageSrc', defaultInputs.imageSrc);
    fixture.componentRef.setInput('imageAlt', defaultInputs.imageAlt);
    fixture.componentRef.setInput('title', defaultInputs.title);
    fixture.componentRef.setInput('description', defaultInputs.description);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('AI Processes');
    expect(text).toContain('AI-powered quiz generation');
  });

  it('should render the image with correct src and alt', () => {
    const fixture = TestBed.createComponent(FeatureCard);
    fixture.componentRef.setInput('imageSrc', defaultInputs.imageSrc);
    fixture.componentRef.setInput('imageAlt', defaultInputs.imageAlt);
    fixture.componentRef.setInput('title', defaultInputs.title);
    fixture.componentRef.setInput('description', defaultInputs.description);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('assets/ai-icon.svg');
    expect(img.getAttribute('alt')).toBe('AI icon');
  });

  it('should default to card variant', () => {
    const fixture = TestBed.createComponent(FeatureCard);
    fixture.componentRef.setInput('imageSrc', defaultInputs.imageSrc);
    fixture.componentRef.setInput('imageAlt', defaultInputs.imageAlt);
    fixture.componentRef.setInput('title', defaultInputs.title);
    fixture.componentRef.setInput('description', defaultInputs.description);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('flex-col')).toBe(true);
  });

  it('should render row variant layout', () => {
    const fixture = TestBed.createComponent(FeatureCard);
    fixture.componentRef.setInput('imageSrc', defaultInputs.imageSrc);
    fixture.componentRef.setInput('imageAlt', defaultInputs.imageAlt);
    fixture.componentRef.setInput('title', defaultInputs.title);
    fixture.componentRef.setInput('description', defaultInputs.description);
    fixture.componentRef.setInput('variant', 'row');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('flex-row')).not.toBe(true);
    expect(container.classList.contains('items-center')).toBe(true);
  });

  it('should switch between card and row variant', () => {
    const fixture = TestBed.createComponent(FeatureCard);
    fixture.componentRef.setInput('imageSrc', defaultInputs.imageSrc);
    fixture.componentRef.setInput('imageAlt', defaultInputs.imageAlt);
    fixture.componentRef.setInput('title', defaultInputs.title);
    fixture.componentRef.setInput('description', defaultInputs.description);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div').classList.contains('flex-col')).toBe(true);
    fixture.componentRef.setInput('variant', 'row');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('flex-col')).toBe(false);
    expect(container.classList.contains('items-center')).toBe(true);
  });
});
