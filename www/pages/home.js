function Home() {
  const isDemoMode = useContext(DemoModeContext);
  const menu = isDemoMode ? (
    <Menu>
      <Button name="Stay-In-The-Loop" />
      <Button name="Pre-Register" />
      <Button name="Message" />
      <Button name="Learn-More" />
    </Menu>
  ) : (
    <Menu>
      <Button name="Regenerative-Community" />
    </Menu>
  )

  return (
    <Page
      id='home'
      menu={menu}
      subtitle = 'Community-Supported Farmer'
      disableTitleClick = {true}
    >
      <Paragraph className='sentiment'>Bringing together <span>local farmers</span> <span>and communities</span></Paragraph>
      <img src="/images/offer-food-001.jpg" />
      <div>
        <ComingSoon />
        <Paragraph className='sentiment dark'>Eat fresh produce <span>grown in <span>your community.</span></span></Paragraph>
        <Paragraph className='sentiment dark'><i>Easily</i> showcase and sell produce to <span>your community.</span></Paragraph>
      </div>
    </Page>
  );
}