import React from 'react'
import * as superagent from 'superagent'

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    if (req) {
      const { db } = req
      const list = await db.collection('Book').find().sort({ createdAt: -1 })
        .toArray()
      return { list }
    }

    const { list } = await superagent.get('http://localhost:3000/api')
      .then(res => res.body)
    return { list }
  }

  constructor () {
    super()
    this.state = { formData: { author: '', title: '' } }
  }

  setForm (prop) {
    return ev => {
      const state = this.state || {}
      const formData = state.formData || {}
      this.setState(Object.assign({}, state, {
        formData: Object.assign({}, formData, {
          [prop]: ev.target.value
        })
      }));
    }
  }

  isFormInvalid () {
    const state = this.state || {}
    const formData = state.formData || {}
    return !formData.author || !formData.title
  }

  remove (_id) {
    return ev => {
      superagent.del(`http://localhost:3000/api/${_id}`)
        .then(() => {
          const state = this.state || {}
          const list = this.state.list || this.props.list || []
          this.setState(Object.assign({}, state, {
            list: list.filter(book => book._id !== _id)
          }))
        })
        .catch(error => console.error(error.stack))
    }
  }

  add () {
    return ev => {
      ev.preventDefault()
      const state = this.state || {}
      const formData = state.formData || {}
      this.setState(Object.assign({}, this.state, {
        formData: { author: '', title: '' }
      }))

      superagent.post('http://localhost:3000/api', formData)
        .then(res => {
          const state = this.state || {}
          const list = this.state.list || this.props.list || []
          this.setState(Object.assign({}, state, {
            list: [res.body.book].concat(list)
          }))
        })
        .catch(error => console.error(error.stack))
    }
  }

  render () {
    const list = this.state.list || this.props.list
    const { formData } = this.state
    return (
      <div id="container">
        <h1>
          New Book
        </h1>
        <div id="input-book">
          <form onSubmit={this.add()}>
            <input
              type="text"
              onChange={this.setForm('title')}
              value={formData.title}
              placeholder="Title" />
            <input
              type="text"
              onChange={this.setForm('author')}
              value={formData.author}
              placeholder="Author" />
            <button disabled={this.isFormInvalid()}>Add</button>
          </form>
        </div>
        <h1>
          Reading List
        </h1>
        <div id="reading-list">
          <ul>
            {
              list.map(book => (
                <div key={book._id}>
                  <span className="remove" onClick={this.remove(book._id)}>
                    &times;
                  </span>&nbsp;
                  <span className="description">
                    <i>{book.title}</i> by {book.author}
                  </span>
                </div>
              ))
            }
          </ul>
        </div>
        <style jsx>{`
          div {
            font-family: 'Helvetica', 'sans-serif';
          }
          #container {
            width: 800px;
            margin-left: auto;
            margin-right: auto;
          }
          h1 {
            color: #ccbc1d;
          }
          button {
            background-color: #ff257b;
            color: #ffffff;
            font-weight: bold;
            border: 0px;
            border-radius: 2px;
            padding: 5px;
            padding-left: 8px;
            padding-right: 8px;
            margin: 5px;
          }
          input {
            padding: 5px;
            border: 0px;
            background-color: #f0f0f0;
            margin: 5px;
          }
          .description {
            position: relative;
            top: -0.2em;
          }
          .remove {
            cursor: pointer;
            color: #ff257b;
            font-size: 1.5em;
          }
        `}</style>
      </div>
    )
  }
}
