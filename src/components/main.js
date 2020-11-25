import React, { Component } from 'react'
import styles from './main.module.css'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ReactComponent as QueenSVG } from '../images/queen.svg'

class Main extends Component {
  constructor (props) {
    super(props)
    this.cellHeight = 60
    this.cellWidth = 60
    this.state = {
      keydown: false
    }

    // binding
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
  }

  componentDidMount () {
    window.addEventListener('keyup', this.onKeyUp, false)
    window.addEventListener('keydown', this.onKeyDown, false)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.onKeyUp, false)
    window.removeEventListener('keydown', this.onKeyDown, false)
  }

  keyDown (key, code) {
    // 値の変更
    const arrayEnter = ['Enter']
    const index = arrayEnter.indexOf(code)
    if (index !== -1) {
      this.props.dispatch({ type: 'CHANGE_CELL' })
    }

    // カーソルの移動
    const arrayArrow = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']
    const indexArrow = arrayArrow.indexOf(code)
    if (indexArrow !== -1) {
      const dys = [0, 1, 0, -1]
      const dxs = [1, 0, -1, 0]
      this.props.dispatch({ type: 'MOVE_CELL', dy: dys[indexArrow], dx: dxs[indexArrow] })
    }

    // リセット
    const arrayEsc = ['Escape']
    const indexEsc = arrayEsc.indexOf(code)
    if (indexEsc !== -1) {
      this.props.dispatch({ type: 'RESET_GRID' })
    }
  }

  onKeyDown (event) {
    if (!this.state.keydown) {
      this.setState({ keydown: true })
      // console.log(`key: ${event.key}, code: ${event.code}`)
      this.keyDown(event.key, event.code)
    }
  }

  onKeyUp (event) {
    this.setState({ keydown: false })
  }

  cellTop (r, c) {
    return r * this.cellHeight + 'px'
  }

  cellLeft (r, c) {
    return c * this.cellWidth + 'px'
  }

  isSelectedCell (r, c) {
    return r === this.props.selectedRow && c === this.props.selectedColumn
  }

  isErrorCell (r, c) {
    return this.props.gridStatus[r][c] === 1
  }

  isClearCell (r, c) {
    return this.props.gridStatus[r][c] === 2
  }

  hasQueen (r, c) {
    return this.props.grid[r][c] === 1
  }

  hasBeam (r, c, d) {
    return this.props.gridBeam[r][c][d] === 1
  }

  onClicked (r, c) {
    this.props.dispatch({ type: 'SELECT_CELL', r, c })
    this.props.dispatch({ type: 'CHANGE_CELL' })
  }

  render () {
    return (
      <div className={styles['display-area']}>
      {
        (() => {
          const list = []
          for (let r = 0; r < this.props.height; r++) {
            for (let c = 0; c < this.props.width; c++) {
              const classes = [styles.cell]
              if (r === this.props.height - 1) {
                classes.push(styles['is-bottom-cell'])
              }
              if (c === this.props.width - 1) {
                classes.push(styles['is-right-cell'])
              }
              if (this.isSelectedCell(r, c)) {
                classes.push(styles['is-selected-cell'])
              }
              if (this.isClearCell(r, c)) {
                classes.push(styles['is-clear-cell'])
              }
              if (this.isErrorCell(r, c)) {
                classes.push(styles['is-error-cell'])
              }
              if (this.hasQueen(r, c)) {
                classes.push(styles['has-queen'])
              }
              const style = {
                top: this.cellTop(r, c),
                left: this.cellLeft(r, c)
              }
              const cell = (<div
              className={classes.join(' ')}
              style={style}
              onClick={this.onClicked.bind(this, r, c)}
              key={`cell${r}-${c}`}>
              <div className={styles['inner-cell']}>
                {
                  this.hasQueen(r, c) && <div><QueenSVG style={{ width: '100%', height: '100%', opacity: 1 }}/></div>
                }
              </div>
                {
                  (() => {
                    const list = []
                    const classNames = [
                      `${styles['inner-point']} ${styles.down}`,
                      `${styles['inner-point']} ${styles.left}`,
                      `${styles['inner-point']} ${styles.up}`,
                      `${styles['inner-point']} ${styles.right}`,
                      `${styles['inner-point']} ${styles['down-left']}`,
                      `${styles['inner-point']} ${styles['up-left']}`,
                      `${styles['inner-point']} ${styles['up-right']}`,
                      `${styles['inner-point']} ${styles['down-right']}`
                    ]
                    for (let i = 0; i < 8; i++) {
                      if (this.hasBeam(r, c, i)) { list.push(<div key={`p${r}-${c}-${i}`} className={classNames[i]} />) }
                    }
                    return list
                  })()
                }
            </div>)
              list.push(cell)
            }
          }
          return list
        })()
      }
      </div>)
  }
}

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  gridStatus: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  gridBeam: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
  selectedRow: PropTypes.number,
  selectedColumn: PropTypes.number
}

// eslint-disable-next-line no-class-assign
Main = connect((state) => state)(Main)
export default Main
