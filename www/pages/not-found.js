function NotFound() {
  return (
    <Page
      id = 'not-found'
      menu = {
        <Menu>
          <Button name="Main-Menu" />
        </Menu>
      }
      subtitle='Page Not Found'
    >
      <Paragraph>Oops! It looks the page you were looking for may have moved or may no longer exist.</Paragraph>
      <Paragraph>Please press the button <MenuLocation /> to return to the main menu.</Paragraph>
      <img src="/images/bench-001.jpg" />
    </Page>
  );
}