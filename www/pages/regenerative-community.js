function RegenerativeCommunity() {
  return (
    <Page
      id='home'
      hideTitle={true}
      menu={
        <Menu>
          <Button name="Regenerative-Community/Join" />
          <Button name="Main-Menu" />
        </Menu>
      }
      subtitle = 'Regenerative Agriculture Community'
    >
      <Paragraph className='sentiment'>A discussion group <span>centered around</span> <span>regenerative agriculture</span></Paragraph>

      <Paragraph style={{textAlign: 'center'}}><i>If you're ready to join, please <Link name="Regenerative-Community/Join">click here</Link>.</i></Paragraph>

      <img src="/images/regenerative-field-001.jpg" />

      <Paragraph>Regenerative agriculture is movement towards growing food and raising livestock in a way that enriches (instead of depletes) the ecosystems we farm in. Regenerative ag is a response to multiple impending global crises including depleted soils, destroyed land- and ocean-ecosystems, and climate change.</Paragraph>

      <Paragraph className='sentiment'>Find fellowship <span>on your</span> <span>regenerative journey</span> 💞 </Paragraph>

      <Paragraph>Since November 2023, over fifty people interested in regenerative ag have come together and begun growing the roots of a new community.</Paragraph>

      <Paragraph>Our growth is slow, and we're still quite small. However, we share together and support each other. Through our conversations, we have created a cozy and relaxed environment for discussing regenerative ag.</Paragraph>

      <Paragraph className='sentiment'> 🌱 Come check out our online community! 🌱 </Paragraph>


      <Paragraph>Whether you're a seasoned farmer or just starting out, our community is a collaborative place to connect, learn, and share about all things regenerative ag.</Paragraph>

      <Paragraph>We welcome people of various regenerative ag interests including: farming, education, technology, art, land stewardship, and more! We'd love to dive into discussions on a variety of topics with you including:</Paragraph>
      <ul>
        <li>introductions</li>
        <li>livestock</li>
        <li>broadacre (cash-crop farming)</li>
        <li>orchards</li>
        <li>gardening</li>
        <li>water cycles</li>
        <li>technology</li>
        <li>agroforestry</li>
        <li>test results, amendments, and inoculants</li>
        <li>projects</li>
        <li>podcasts and videos</li>
        <li>books and articles</li>
        <li>social media</li>
        <li>...</li>
      </ul>

      <Paragraph>Let’s grow together and make a difference!</Paragraph>

      <Paragraph>We welcome you to come connect with us, exchange ideas, ask & discuss questions, and contribute to community projects.</Paragraph>

      <Paragraph className='sentiment'> 🌍 Be a part of the change! 🌏 </Paragraph>

      <Paragraph>If we come together and share our perspectives and experiences, we can...</Paragraph>
      <ul>
        <li>increase our chances of our mutual success and prosperity</li>
        <li>increase the healing that regenerative agriculture has on our planet, our local communities, and ourselves</li>
        <li>develop fulfilling relationships as we connect on restoring life through the way we choose to farm</li>
      </ul>

      <Paragraph className='sentiment'>We hope to meet you soon!</Paragraph>

      <Paragraph>You can join our community by clicking the "Join" button <MenuLocation/>. </Paragraph>

      <img src="/images/regenerative-collage-001.jpg" />

      <Paragraph><i>Note: Our community is independent from CSFarmer. CSFarmer is merely hosting this "about" page until we have our own website.</i></Paragraph>
    </Page>
  );
}
