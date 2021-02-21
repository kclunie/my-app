import React from 'react'
import ToDoCard from '../components/ToDoCard'
import CreateCard from '../components/CreateCard'
import ToDoCardContainer from './ToDoCardContainer'


export default class MainContainer extends React.Component {

  state = {
    cards: []
  }

  componentDidMount(){
    fetch("http://localhost:3000/cards")
   //fetch("https://my-app-api-backend.herokuapp.com/cards")
    .then(resp => resp.json())
    .then(cards => {
      this.setState({
        cards: cards
      })
    })
  }

  createNewCard = (input) => {
      console.log(input)
    fetch("http://localhost:3000/cards", {
    //fetch("https://my-app-api-backend.herokuapp.com/cards", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        title: input
      })
    })
    .then(resp => resp.json())
    .then(newCard => {
      this.setState({
        cards: [...this.state.cards, newCard]
      })
    })
    console.log(this.state.cards)
  }

  addList = (cardId, input) => {
    fetch("http://localhost:3000/lists", {
    //fetch("https://my-app-api-backend.herokuapp.com/lists", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        description: input,
        card_id: cardId,
        completed: false
      })
    })
    .then(resp => resp.json())
    .then(newList => {
      const foundCard = {...this.state.cards.find(card => card.id === cardId)}
      foundCard.lists = [...foundCard.lists, newList]

      const newCards = this.state.cards.map(card => {
        if (card.id === cardId){
          return foundCard
        } else {
          return card
        }
      })

      this.setState({
        cards: newCards
      })

    })
    console.log(this.state.cards)
  }

  handleClickList = (cardId, listId) => {

    const foundCard = {...this.state.cards.find(card => card.id === cardId)}
    const foundList = foundCard.lists.find(list => list.id === listId)

    let newState = null

    if (foundList.completed) {
      newState = false
    } else {
      newState = true
    }

    fetch(`http://localhost:3000/lists/${listId}`, {
    //fetch(`https://my-app-api-backend.herokuapp.com/lists/${listId}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        completed: newState
      })
    })
    .then(resp => resp.json())
    // .then(function(json){
    //     console.log(json)
    //   })
    .then(newList => {

      const newLists = foundCard.lists.map(list => {
        if (list.id === listId){
          return newList
        } else {
          return list
        }
      })
      foundCard.lists = newLists


      const newCards = this.state.cards.map(card => {
        if (card.id === cardId) {
          return foundCard
        } else {
          return card
        }
      })

      this.setState({
        cards: newCards
      })
    })
  }

  deleteCard = (cardId) => {
    console.log("got to maincontainer", cardId)
     fetch(`http://localhost:3000/cards/${cardId}`, { 
     //fetch(`https://my-app-api-backend.herokuapp.com/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        // body: JSON.stringify({
        //   title: input
        // })
      })
      .then(resp => console.log(resp))
   //   .then(resp => resp.json())
      window.location.reload(false);
      console.log(this.state.cards)
  }
  

  render(){
    return (
      <div className="main-container">
        {/* <ToDoCardContainer cards={this.state.cards} addList={this.addList} handleClickList={this.handleClickList}/> */}
        <ToDoCardContainer cards={this.state.cards} addList={this.addList} deleteCard={this.deleteCard} handleClickList={this.handleClickList}/>
        <CreateCard createNewCard={this.createNewCard}/>
      </div>
    )
  }

}