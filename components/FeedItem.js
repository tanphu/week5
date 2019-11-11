import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import moment from 'moment';

export default function FeedItem(props) {
    const { item: {
        title, urlToImage, source: { name }, content, publishedAt, url,
    } } = props;

    const onPress = url => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log(`Don't know how to open URL: ${url}`);
            }
        });
    };


    return (
        <Card title={title} image={{ uri: urlToImage }}>
            <View style={styles.row}>
                <Text style={styles.label}>Source</Text>
                <Text style={styles.info}>{name}</Text>
            </View>
            <Text>{content}</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Published</Text>
                <Text style={styles.info}>
                    {moment(publishedAt).format('LLL')}
                </Text>
            </View>
            <Button icon={<Icon />} title="Read more" backgroundColor="#03A9F4" onPress={()=>onPress(url)} />
        </Card>
    );
}

const styles = StyleSheet.create({
    containerFlex: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        marginTop: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    header: {
        height: 30,
        width: '100%',
        backgroundColor: 'pink'
    },
    row: {
        flexDirection: 'row'
    },
    label: {
        fontSize: 16,
        color: 'black',
        marginRight: 10,
        fontWeight: 'bold'
    },
    info: {
        fontSize: 16,
        color: 'grey'
    }
});