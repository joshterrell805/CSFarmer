function WhyLocal() {
  return (
    <Page 
      id = 'why-local'
      subtitle = 'Why Local Matters'
      menu = {
        <Menu>
          <Button name="Stay-In-The-Loop" />
          <Button name="Message" />
          <Button name="Back" />
        </Menu>
        }
    >
      <img src="/images/salad-001.jpg" />
      <Paragraph> Buying locally matters. However, buying local <i>food</i> is an especially impactful decision. Here's why:</Paragraph>

      <SectionTitle>Taste and Nutrition</SectionTitle>
      <Paragraph>The produce we buy at the grocery store is usually picked prematurely. Picking and shipping underripe food reduces spoilage during the lengthy distribution process from farmers to grocery stores. However, there are costs to harvesting food prematurely and transporting it for weeks or even longer.</Paragraph>
      <Paragraph>If you've ever eaten a ripe tomato off the vine, you probably remember how different its texture and taste were compared to tomatoes you've had from the grocery store. Unlike shipped produce, local produce is often picked when it is ripe and eaten when it is fresh.</Paragraph>
      <Paragraph>Local food is almost always fresher, and fresher food is often more flavorful and richer in nutrients. Eating fresh local produce supports our health and our happiness.</Paragraph>

      <SectionTitle>Community</SectionTitle>
      <Paragraph>The name "CSFarmer" comes from the term "CSA" which means "Community-Supported Agriculture."</Paragraph>
      <Paragraph>When we eat local food, we support people in our community. We help our area have a little more resources to go around. When carried on for a while, small improvements compound into large positive changes in our communities.</Paragraph>

      <SectionTitle>Posterity and Environment</SectionTitle>
      <Paragraph>Eating local food reduces pollution and reduces waste of our natural resources. It improves our environments and leaves more to our children and the following generations. Eating local produce is one way to join many people around the world in making a beautiful difference.</Paragraph>


      <SectionTitle>Food Security</SectionTitle>
      <Paragraph>There are several reasons that food shortages have occured and will continue to occur. Having both local <i>and</i> global sources of food increases the resilience of our communities, and leads to more food security worldwide.</Paragraph>
    </Page>
  );
}