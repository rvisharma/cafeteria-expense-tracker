import { CafeteriaTrackerPage } from './app.po';

describe('cafeteria-tracker App', () => {
  let page: CafeteriaTrackerPage;

  beforeEach(() => {
    page = new CafeteriaTrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
