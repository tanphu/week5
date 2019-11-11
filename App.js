import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Platform, StatusBar } from 'react-native';

import FeedItem from './components/FeedItem';

const HEIGHT_STATUSBAR = (Platform.OS == 'ios') ? 40 : StatusBar.currentHeight;
const API_URL = "https://newsapi.org/v2/top-headlines?country=us&apiKey=6eec2f7fe6cd4c40a3fef8f33f5778fe";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isFooterLoading: false,
      isHeaderLoading: false,
      listArticles: [],
      pageNumber: 0,
      lastPageReached: false,
      isLoadingRefresh: false,
    }
  }

  //chạy 1 lần sau khi render lần đầu tiên xong
  componentDidMount = async () => {
    this.setState({ isLoading: true });
    this.getNews();
  }

  renderItem = ({ item }) => {
    return <FeedItem item={item} />
  }

  getNews = async (isFooterLoading = false) => {
    if (!this.state.lastPageReached) {
      const newPage = this.state.pageNumber + 1;
      this.setState({ isFooterLoading: isFooterLoading });
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=6eec2f7fe6cd4c40a3fef8f33f5778fe&page=${newPage}`);
      const jsonData = await response.json();
      if (jsonData.articles.length > 0) {
        const newArticleList = await this.filterForUniqueArticles(this.state.listArticles.concat(jsonData.articles));
        this.setState({ listArticles: newArticleList, pageNumber: newPage, isLoading: false });
      }
      else {
        this.setState({ lastPageReached: true });
      }
      this.setState({ isFooterLoading: false });
    }
    else { console.log("last page") }
  }

  filterForUniqueArticles = async (arr) => {
    const cleaned = [];
    arr.forEach(itm => {
      let unique = true;
      cleaned.forEach(itm2 => {
        const isEqual = JSON.stringify(itm) === JSON.stringify(itm2);
        if (isEqual) unique = false;
      });
      if (unique) cleaned.push(itm);
    });
    return cleaned;
  };

  onRefresh = async () => {
    await this.setState({ listArticles: [], pageNumber: 0, isLoadingRefresh: true, lastPageReached: false });
    console.log(this.state.isLoadingRefresh);
    await this.getNews();
    this.setState({isLoadingRefresh: false,})
  }

  render() {
    const { isLoading, listArticles, isFooterLoading, lastPageReached, isLoadingRefresh } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" animating={isLoading} />
        </View>);
    }
    else {
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="blue" barStyle="dark-content" />
          <View style={styles.row}>
            <Text style={styles.label}>Articles Count:</Text>
            <Text style={styles.info}>{listArticles.length}</Text>
          </View>
          <FlatList
            style={styles.flatList}
            data={listArticles}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.title}
            onEndReached={() => {!isLoadingRefresh?this.getNews(true):{}}}
            onEndReachedThreshold={1}
            ListFooterComponent={
              lastPageReached ? <View style={styles.lastPage}>
                <Text style={{ fontSize: 25, fontWeight: "bold", color: 'gray' }}>No more articles</Text>
              </View> : <ActivityIndicator size="large" animating={isFooterLoading} />}
            refreshing={isLoadingRefresh}
            onRefresh={this.onRefresh}
          />
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center",
    marginTop: HEIGHT_STATUSBAR,
  },
  flatList: {
    width:'100%',
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
  },
  lastPage: {
    alignItems: 'center',
    paddingBottom: 10,
  }
});
