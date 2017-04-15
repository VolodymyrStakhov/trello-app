import { TrelloAppPage } from './app.po';

describe('trello-app App', function() {
  let page: TrelloAppPage;

  beforeEach(() => {
    page = new TrelloAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
