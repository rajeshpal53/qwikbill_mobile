
import { StyleSheet,View } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
function CustomerDetail({detail}) {
  return (
    <View style={styles.container}>
    <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.titleStyle}>{`${detail.firstname} ${detail.lastname}`}</Title>
          <Paragraph style={styles.paragraph}>ID: {detail._id}</Paragraph>
          <Paragraph style={styles.paragraph}>Email: {detail.email}</Paragraph>
          <Paragraph style={styles.paragraph}>Phone: {detail.phone}</Paragraph>
          <Paragraph style={styles.paragraph}>Country: {detail.country}</Paragraph>
          <Paragraph style={styles.paragraph}>Enabled: {detail.enabled ? 'Yes' : 'No'}</Paragraph>
          <Paragraph style={styles.paragraph}>Client: {detail.isClient ? 'Yes' : 'No'}</Paragraph>
          <Paragraph style={styles.paragraph}>Public: {detail.isPublic ? 'Yes' : 'No'}</Paragraph>
          <Paragraph style={styles.paragraph}>Created: {new Date(detail.created).toLocaleString()}</Paragraph>
          <Paragraph style={styles.paragraph}>Updated: {new Date(detail.updated).toLocaleString()}</Paragraph>
        </Card.Content>
      </Card>
      </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor:'#0c3b73'
  },
  paragraph:{
    marginVertical:10,
    color:"#fff"
  },
  titleStyle:{
    color:"#fff",
    fontWeight: "bold",
    marginBottom:10
  }
});

export default CustomerDetail
