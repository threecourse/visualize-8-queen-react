import { toast } from 'react-toastify'

export function initialGrid (h, w) {
  const grid = []
  for (let r = 0; r < h; r++) {
    const row = []
    for (let c = 0; c < w; c++) {
      const v = 0
      row.push(v)
    }
    grid.push(row)
  }
  return grid
}

export function initialGridBeam (h, w) {
  const D = 8
  const grid = []
  for (let r = 0; r < h; r++) {
    const row = []
    for (let c = 0; c < w; c++) {
      const v = []
      for (let d = 0; d < D; d++) {
        v.push(0)
      }
      row.push(v)
    }
    grid.push(row)
  }
  return grid
}

export function copyGrid (_grid, h, w) {
  const grid = []
  for (let r = 0; r < h; r++) {
    const row = []
    for (let c = 0; c < w; c++) {
      row.push(_grid[r][c])
    }
    grid.push(row)
  }
  return grid
}

export function calcGridStatus (_grid, h, w) {
  const grid = _grid
  const gridStatus = initialGrid(h, w)
  // U,R,D,L,UR,DR,DL,UL
  const dys = [-1, 0, 1, 0, -1, 1, 1, -1]
  const dxs = [0, 1, 0, -1, 1, 1, -1, -1]

  let count = 0
  let isError = false

  // エラー判定
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (grid[r][c] === 1) {
        count += 1
        for (let d = 0; d < dys.length; d++) {
          const dy = dys[d]
          const dx = dxs[d]
          let rr = r
          let cc = c
          while (true) {
            rr += dy
            cc += dx
            if (!(rr >= 0 && rr < h && cc >= 0 && cc < w)) break
            if (grid[rr][cc] === 1) {
              // 干渉するものがあればエラー
              gridStatus[r][c] = 1
              isError = true
              break
            }
          }
        }
      }
    }
  }

  // エラーが無く、十分な個数がある場合はクリア
  if (count === h && !isError) {
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        gridStatus[r][c] = 2
      }
    }
  }

  return gridStatus
}

export function calcGridBeam (_grid, h, w) {
  const grid = _grid
  const gridBeam = initialGridBeam(h, w)

  // U,R,D,L,UR,DR,DL,UL
  const dys = [-1, 0, 1, 0, -1, 1, 1, -1]
  const dxs = [0, 1, 0, -1, 1, 1, -1, -1]

  // ビーム判定
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (grid[r][c] === 1) {
        for (let d = 0; d < dys.length; d++) {
          const dy = dys[d]
          const dx = dxs[d]
          let rr = r
          let cc = c
          while (true) {
            rr += dy
            cc += dx
            if (!(rr >= 0 && rr < h && cc >= 0 && cc < w)) break
            gridBeam[rr][cc][d] = 1
            if (grid[rr][cc] === 1) {
              // 干渉するものがあれば止める
              break
            }
          }
        }
      }
    }
  }

  return gridBeam
}

const initialWidth = 8
const inititalHeight = 8

export const initial = {
  width: initialWidth,
  height: inititalHeight,
  grid: initialGrid(inititalHeight, initialWidth), // [y, x] - 0/1, queen exists or not
  gridStatus: initialGrid(inititalHeight, initialWidth), // [y, x] - 0: none, 1: error, 2: clear
  gridBeam: initialGridBeam(inititalHeight, initialWidth), // [y, x, d] - 0/1, queen's beam reached or not
  selectedRow: 0,
  selectedColumn: 0
}

export const reducer = (state = initial, action) => {
  switch (action.type) {
    case 'SELECT_CELL': {
      return {
        ...state,
        selectedRow: action.r,
        selectedColumn: action.c
      }
    }
    case 'CHANGE_CELL': {
      const r = state.selectedRow
      const c = state.selectedColumn
      const grid = copyGrid(state.grid, state.height, state.width)
      if (grid[r][c] === 0) {
        grid[r][c] = 1
      } else {
        grid[r][c] = 0
      }
      const gridStatus = calcGridStatus(grid, state.height, state.width)
      const gridBeam = calcGridBeam(grid, state.height, state.width)
      // reducerにtoastを入れるのは好ましいか不明
      if (gridStatus[0][0] === 2) {
        toast.success('Cleared!')
      }
      return {
        ...state,
        grid: grid,
        gridStatus: gridStatus,
        gridBeam: gridBeam
      }
    }
    case 'RESET_GRID': {
      const grid = initialGrid(state.height, state.width)
      const gridStatus = calcGridStatus(grid, state.height, state.width)
      const gridBeam = calcGridBeam(grid, state.height, state.width)
      // reducerにtoastを入れるのは好ましいか不明
      toast.info('Reset!')
      return {
        ...state,
        grid: grid,
        gridStatus: gridStatus,
        gridBeam: gridBeam
      }
    }
    case 'MOVE_CELL': {
      const dy = action.dy
      const dx = action.dx
      const rr = state.selectedRow + dy
      const cc = state.selectedColumn + dx
      let selectedRow
      let selectedColumn
      if (rr >= 0 && rr < state.height && cc >= 0 && cc < state.width) {
        selectedRow = rr
        selectedColumn = cc
      } else {
        selectedRow = state.selectedRow
        selectedColumn = state.selectedColumn
      }
      return {
        ...state,
        selectedRow: selectedRow,
        selectedColumn: selectedColumn
      }
    }
    default:
      return state
  }
}
