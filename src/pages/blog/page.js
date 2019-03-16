import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Axios from '../../components/_axios';
import './blogpage.css';


function Article(props) {
  return (
    <div className='card has-shadow article' key={props.key} onClick={props.onClick}>
      <div className='card-content'>
        <p className='title is-size-5'>{props.title}</p>
        <div className='card-mid block-inline'>
          <p className='is-size-7'>{props.created}</p>
          <div className='tags is-pulled-right'>
            {props.tags.map((item, i) =>
              <span className='tag' key={i.toString()}>{item}</span>
            )}
          </div>
        </div>
        <p className='is-size-6-half'>{props.excerpt}</p>
      </div>
    </div>
  );
}

Article.propTypes = {
  key: PropTypes.string,
  title: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  excerpt: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}


export default class BlogPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      articles: [],
      moreArticle: true,
      loadedArticles: 0,
      requestedArticles: 5,
      redirect: null,
      toggleOn: false,
      tagFilter: '所有',
      tags: []
    }

    this.loadMoreArticle = this.loadMoreArticle.bind(this);
    this.loadNewTagArticle = this.loadNewTagArticle.bind(this);
  }

  componentDidMount() {
    this.loadNewTagArticle(this.state.tagFilter);
    Axios.post(
      'action/blog/tags',
      {}
    ).then(response => {
      this.setState({tags: response.data.tags})
    });
  }

  loadNewTagArticle(tagName) {
    Axios.post(
      'action/blog/articles',
      {
        tagFilter: tagName,
        offset: 0,
        length: this.state.requestedArticles
      }
    ).then(response => {
      let data = response.data;
      this.setState({
        articles: data.articles,
        moreArticle: data.articles.length === this.state.requestedArticles,
        loadedArticles: data.articles.length,
        tagFilter: tagName
      });
    });
  }

  loadMoreArticle() {
    Axios.post(
      'action/blog/articles',
      {
        tagFilter: this.state.tagFilter,
        offset: this.state.loadedArticles,
        length: this.state.requestedArticles
      }
    ).then(response => {
      let data = response.data;
      this.setState(prev => ({
        articles: Array.prototype.concat(prev.articles, data.articles),
        moreArticle: data.articles.length === this.state.requestedArticles,
        loadedArticles: prev.loadedArticles + data.articles.length,
        tagFilter: this.state.tagFilter
      }));
    });
  }

  render() {
    if (this.state.redirect) return (<Redirect push to={'/blog/' + this.state.redirect.toString()} />);
    return (
      <div className='columns'>
        <div className='column is-2'></div>
        <div className='column is-2'>
          <div className='card has-shadow'>
            <div className='card-content has-background-primary has-text-centered has-text-white'>
              <p className='is-size-2'><i className='fas fa-grin-squint-tears'></i></p>
              <p className='is-size-7'>@easterlywave</p>
            </div>
            <div className='card-content has-background-primary has-text-centered has-text-white is-hidden-desktop' style={{padding: '0.25rem'}}>
              <p><i className={classnames([
                'fas',
                this.state.toggleOn ? 'fa-angle-up' : 'fa-angle-down'
              ])} onClick={() => {this.setState(prev => ({toggleOn: !prev.toggleOn}))}}></i></p>
            </div>
            <div className={classnames({
              'card-content': true,
              'is-hidden-touch': !this.state.toggleOn
            })}>
              <div className='field is-grouped is-grouped-multiline'>
                {this.state.tags.map((item, i) =>
                  <div className='control' key={i.toString()}>
                    <div className='tags has-addons'>
                      <a
                        className='tag is-primary'
                        onClick={() => {this.loadNewTagArticle(item.name)}}
                      >{item.name}</a>
                      <span className={classnames({
                        'tag': true,
                        'is-primary': item.name === this.state.tagFilter
                      })}>{item.val}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='column is-6'>
          {this.state.articles.map((article, i) =>
            <Article
              key={article.pk.toString()}
              title={article.title}
              created={article.created}
              tags={article.tags}
              excerpt={article.excerpt}
              onClick={() => {this.setState({redirect: article.pk})}}
            />
          )}
          { this.state.moreArticle &&
            <div className='level'>
            <div className='level-item'>
              <button className='button is-primary is-rounded' onClick={() => {this.loadMoreArticle()}}>加载更多...</button>
            </div>
            </div>
          }
        </div>
        <br/>
      </div>
    )
  }
}
