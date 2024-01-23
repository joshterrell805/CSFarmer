function LearnMore() {
  return (
    <Page
      menu={
        <Menu>
          <Button name="Stay-In-The-Loop" />
          <Button name="Pre-Register" />
          <Button name="Message" />
          <Button name="Why-Local" />
          <Button name="Pricing" />
          <Button name="Team" />
          <Button name="Main-Menu" />
        </Menu>
      }
      subtitle = 'Learn More'
    >
      <img src="/images/veggie-stand-001.jpg" />
      <Paragraph>CSFarmer is a developing hub for buying and selling local produce. Individuals, families, and businesses will be able to view up-to-date listings of <i>local</i> produce, place orders, and pick up their food or have it delivered.</Paragraph>
      <Paragraph>CSFarmer is geared towards empowering small-scale farmers. In addition to managing inventory and orders, farmers will be able to perform frequent tasks, like updating inventory, using <i>simple voice commands</i>. For example, saying "add four boxes/crates/pounds/kilos of potatoes" will be all it takes to share your updated inventory with your community.</Paragraph>
      <Paragraph>Local produce is becoming increasingly rare as large farms around the globe ship the vast majority of our food. Even in-season and highly-perishable produce usually arrives at our tables through lengthy and expensive distribution processes. It doesn't have to be this way. You can use the buttons <MenuLocation /> to help the growing group of volunteers turn CSFarmer into a reality.</Paragraph>
    </Page>
  );
}