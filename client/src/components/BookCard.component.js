import React, { Component } from 'react'
import { Row, Col, Card, Image, Button } from 'react-bootstrap'
import db from '../utils/db'
import noThumbnail from '../assets/images/no-thumbnail.png'

class BookCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      id: null,
      authors: [],
      description: '',
      image: '',
      link: '',
      title: ''
    }

    this.saveBook = this.saveBook.bind(this)
    this.unsaveBook = this.unsaveBook.bind(this)
  }

  componentDidMount () {
    this.setState({
      id: this.props.id,
      authors: this.props.authors,
      description: this.props.description,
      image: this.props.image,
      link: this.props.link,
      title: this.props.title
    })
  }

  async saveBook () {
    const newSavedBook = {
      authors: this.state.authors || 'No author provided',
      description: this.state.description || 'No description provided',
      image: this.state.image,
      link: this.state.link,
      title: this.state.title
    }
    const status = await db.saveBook(newSavedBook)
    this.props.notify(status.message)
  }

  async unsaveBook () {
    const id = this.state.id
    const status = await db.unsaveBook(id)
    this.props.notify(status.message)
    this.props.getBooksFromDb()
  }

  render () {
    const { fromSaved } = this.props
    let hasImage = true
    if (this.state.image === 'false') hasImage = false

    return (
      <div>
        <Card style={{ marginTop: '1rem' }}>
          <Card.Header>
            {this.state.title}
            <span style={{ opacity: '0.8', fontSize: '0.75rem', marginLeft: '1rem' }}>
              {this.state.authors ? `By: ${this.state.authors.join(', ')}` : 'No author provided'}
            </span>
            <div className='float-right'>
              <Button variant='outline-info'
                size='sm'
                href={this.state.link}
                target='_blank'>
                  View
              </Button>{' '}
              {fromSaved ? (
                <Button variant='outline-danger'
                  size='sm'
                  onClick={() => this.unsaveBook()}>
                  Unsave
                </Button>
              ) : (
                <Button variant='outline-primary'
                  size='sm'
                  onClick={() => this.saveBook()}>
                  Save
                </Button>
              )}
            </div>
          </Card.Header>
          <Row style={{ padding: '0.5rem 1rem' }}>
            <Col xs={2} style={{ paddingLeft: '1rem' }}>
              {hasImage ? (
                <Image src={this.state.image} thumbnail fluid />
              ) : (
                <Image src={noThumbnail} thumbnail fluid />
              )}
            </Col>
            <Col xs={10} style={{ paddingLeft: '0', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '218px' }}>
              {this.state.description || 'No description provided'}
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}

export default BookCard