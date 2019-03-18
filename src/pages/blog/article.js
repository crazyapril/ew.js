import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import Axios from '../../components/_axios';
import page404 from '../404';

export default class Article extends Component {

  constructor(props) {
    super(props)

    this.state = {
      article: {
        title: '',
        created: '',
        author: '',
        tags: [],
        content: ''
      },
      status404: false
    }
  }

  componentDidMount() {
    Axios.post(
      '/action/blog/article',
      {pk: this.props.pk}
    ).then(response => {
      if (response.data.error) this.setState({status404: true});
      else this.setState({article: response.data.article});
    });
  }

  render() {
    if (this.state.status404) return page404();
    return (
      <div className='columns'>
        <div className='column is-2'></div>
        <div className='column is-8'>
          <h1 className='title'>{this.state.article.title}</h1>
          <div className='level is-mobile'>
            <div className='level-left is-size-6-half'>
              <div className='level-item'><p>{this.state.article.created}</p></div>
              <div className='level-item'><p>{this.state.article.author}</p></div>
            </div>
            <div className='level-right is-size-6-half'>
              <div className='level-item'>
                <div className='tags'>
                  {this.state.article.tags.map(tag =>
                    <div className='tag' key={tag}>{tag}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {this.state.article.created && <hr/>}
          <div className='content'>
            <ReactMarkdown source={this.state.article.content} />
          </div>
        </div>
      </div>
    )
  }
}
