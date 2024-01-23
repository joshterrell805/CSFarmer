function AboutTheTeam() {
  return (
    <Page
      id = 'about'
      subtitle = 'About the Team'
      menu = {
        <Menu>
          <Button name="Message" />
          <Button name="Back" />
        </Menu>
      }
    >   
      <img src="/images/horses-001.jpg" />
      <Paragraph>The CSFarmer team currently includes the founder and an increasing number of volunteers who have been providing their feedback and support.</Paragraph>
      <Paragraph>If you are interested in contributing to CSFarmer, you can:</Paragraph>
      <ul>
        <li>Share CSFarmer with people who may be interested</li>
        <li><Link name='Message'>Share your thoughts, questions, or feedback</Link></li>
        <li><Link name='Pre-Register'>Pre-register as a farmer</Link></li>
        <li><Link name='Stay-In-The-Loop'>Indicate your interest to farmers in your community</Link></li>
      </ul>
      <SectionTitle>About the Founder</SectionTitle>
      <Paragraph>Josh Terrell is an up-and-coming farmer in North Carolina, USA. He is transitioning into agriculture from software development. Josh started CSFarmer after a couple of farmer-friends shared why current online listing tools don't work for them. He is eager to use his experience in software and data science to help small-scale farmers connect with their local communities. You can learn more about Josh and his farm at <a href="https://somagardens.org" target="_blank">SomaGardens.org</a>.</Paragraph>
    </Page>
  );
}