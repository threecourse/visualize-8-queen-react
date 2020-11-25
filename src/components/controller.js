import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IconContext } from 'react-icons'
import { FaArrowLeft, FaArrowUp, FaArrowRight, FaArrowDown } from 'react-icons/fa'
import styles from './controller.module.css'

class Controller extends Component {
  moveCell (dy, dx) {
    this.props.dispatch({ type: 'MOVE_CELL', dy, dx })
  }

  changeCell () {
    this.props.dispatch({ type: 'CHANGE_CELL' })
  }

  resetGrid () {
    this.props.dispatch({ type: 'RESET_GRID' })
  }

  render () {
    return (
    <div>
      <div className="is-size-4">
        概要
      </div>
      <div className="pt-2">
        <a
          href="https://ja.wikipedia.org/wiki/%E3%82%A8%E3%82%A4%E3%83%88%E3%83%BB%E3%82%AF%E3%82%A4%E3%83%BC%E3%83%B3"
        >エイト・クイーン問題</a
        >を解いて下さい
      </div>
      <div className="is-size-4 pt-4">
        操作方法
      </div>
      <div className="pt-2">
        キーボード：
      </div>
      <div className="content my-0">
        <ul className="mt-1">
          <li>矢印キーでグリッドの移動</li>
          <li>Enterキーでクイーンの配置／解除</li>
          <li>Escキーでリセット</li>
        </ul>
      </div>
      <div className="pt-3">
        マウス：
      </div>
      <div>
        マウスのクリックでもクイーンの配置・解除ができます。
      </div>
      <div className="pt-3">
        ボタン：
      </div>
      <div>
        以下のボタンでも操作ができます
      </div>
      <div className="pt-2">
        <div className={styles['button-area']}>
          <IconContext.Provider value={{ style: { fontSize: '1em' } }} >
          <div className={`button ${styles['button-left']}`} onClick={this.moveCell.bind(this, 0, -1)}>
            <FaArrowLeft />
          </div>
          <div className={`button ${styles['button-up']}`} onClick={this.moveCell.bind(this, -1, 0)}>
            <FaArrowUp />
          </div>
          <div className={`button ${styles['button-right']}`} onClick={this.moveCell.bind(this, 0, 1)}>
            <FaArrowRight />
          </div>
          <div className={`button ${styles['button-down']}`} onClick={this.moveCell.bind(this, 1, 0)}>
            <FaArrowDown />
          </div>
          <div className={`button ${styles['button-place']}`} onClick={this.changeCell.bind(this)}>
            配置／解除
          </div>
          </IconContext.Provider>
        </div>
      </div>
      <div className="pt-1">
        <a className="button is-info" onClick={this.resetGrid.bind(this)}>リセット</a>
      </div>
    </div>)
  }
}

Controller.propTypes = {
  dispatch: PropTypes.func.isRequired
}

// eslint-disable-next-line no-class-assign
Controller = connect((state) => state)(Controller)
export default Controller
