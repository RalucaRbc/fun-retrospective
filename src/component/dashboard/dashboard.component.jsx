import { Button, TextField } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { db, ts } from '../../config/firebase'
import { navigate } from '@reach/router'
import * as DS from './dashboard.style'
import { RetrospectiveList } from '../retrospective-list'

export const Dashboard = () => {
  const [list, setList] = useState([])
  const [retrospectiveName, setRetrospectiveName] = useState('')

  // vreau sa chem ceva o singura data
  useEffect(() => {
    // si asa facem ceva o singura data
    db
      .collection('retrospective')
      .orderBy('ts', 'desc')
      .onSnapshot(snapshot => {
        setList(snapshot.docs.map(retrospective => ({
          id: retrospective.id,
          ...retrospective.data()
        })))
        // console.log(snapshot.size)
      })
  }, [])

  const sendAction = (action, id) => {
    switch(action) {
      case 'delete':
        deleteItem(id);
        break;
      case 'select':
        selectItem(id);
        break;
      default:
        console.log('Moare verisorul de ciuda')
    }
  }

  const selectItem = id => {
    // selectItem
    navigate(`/room/${id}`)
  }

  const deleteItem = id => {
    console.log(`Sterge-l pe ala cu id: ${id}`)
    db
      .collection('retrospective')
      .doc(id)
      .delete()
  }

  const handleGigiSubmit = e => {
    e.preventDefault()
    if (retrospectiveName.length > 3) {
      db
        .collection('retrospective')
        .add({
          retrospectiveName,
          ts
        })

      setRetrospectiveName('')
    }
  }

  const faCevaCuAsta = e => {
    const { value } = e.target
    setRetrospectiveName(value)
  }

  console.log(list)

  return (
    <form onSubmit={handleGigiSubmit}>
      <DS.StyledFormWrapper>
        <h1>Create a new retrospective</h1>
        <div>
          <TextField
            variant="outlined"
            color="primary"
            label="Restrospective name"
            value={retrospectiveName}
            onChange={faCevaCuAsta}
          />
        </div>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
        >
          Create retrospective
        </Button>
        <RetrospectiveList sendAction={sendAction} list={list} />
      </DS.StyledFormWrapper>
    </form>
  )
}
