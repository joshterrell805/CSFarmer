function Pricing() {
  return (
    <Page
      id = 'pricing'
      subtitle = 'Pricing'
      menu = {
        <Menu>
          <Button name="Pre-Register" />
          <Button name="Message" />
          <Button name="Back" />
        </Menu>
      }
    >
      <SectionTitle>Free to List</SectionTitle>
      <Paragraph>Farmers will be able to showcase their farms, co-ops, and produce <i>for free</i>.</Paragraph>
      <Paragraph>Listings may include: current inventory, upcoming inventory, pictures, text, contact info, directions, and links to other websites.</Paragraph>
      
      <SectionTitle>Affordable to Sell Online</SectionTitle>
      <Paragraph>CSFarmer will also enable farmers to accept online orders.</Paragraph>
      <Paragraph>Farmers will be charged a modest fee <i>if</i> their online sales (e.g. credit card, EBT, PayPal) <i>on this website</i> exceed $1,000 in a given month. Sales that are not conducted on CSFarmer (e.g. cash orders) will <i>not</i> count towards your monthly online sales on CSFarmer.</Paragraph>
      <Paragraph>Online sales fee:</Paragraph>
      <Indent>
        <Paragraph><b>Free</b> every month you make less than $1,000 from online orders.</Paragraph>
        <Paragraph><b>$5 per month</b> on months you make between $1,000 and $2,000 from online orders.</Paragraph>
        <Paragraph><b>$10 per month</b> on months you make between $2,000 to $4,000 from online orders.</Paragraph>
        <Paragraph><b>$20 per month</b> on months you make more than $4,000 from online orders.</Paragraph>
      </Indent>
      <Paragraph>For most of us, finances are limited. CSFarmer can offer an affordable pricing model like this by focusing on your <i>key</i> needs. However we can only do that with input from farmers like you. Please consider pre-registering to help CSFarmer succeed.</Paragraph>
      <img src="/images/dirt-001.jpg" />
    </Page>
  );
}