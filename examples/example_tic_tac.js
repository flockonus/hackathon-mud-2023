// CODE: https://github.com/briancaffey/tic-tac-react/tree/master/app/components
// https://briancaffey.github.io/2017/10/03/simple-games-in-react.html/

import React from 'react';
// import { grid } from '../data/grid.js';
import { Square } from './Square';

export class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dim:15,
      grid:Array(3).fill(0).map(x=>Array(3).fill("+")),
      player:'X',
      winner:null,
      active:true,
    };
    this.handleOnClick = this.handleOnClick.bind(this);
    this.checkWins = this.checkWins.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.dims = [parseFloat(500/this.state.grid.length), parseFloat(500/this.state.grid[0].length)]
  }

  handleReset(){
    const newGrid = Array(this.state.dim).fill(0).map(x=>Array(this.state.dim).fill("+"))
    this.setState({'grid':newGrid, 'player':'X'});
  }

  checkWins(x, y){
    const g = this.state.grid

    function checkDiagonal1(){
      if (x == y){
        const result = new Set(g.map((_, i)=>g[i][i]));
        announceWin(result);
      }
    }

    function checkDiagonal2(){
      if (x+y+1 == g.length){
        const result = new Set(g.map((_, i)=>g[i][g.length-1-i]))
        announceWin(result);
      }
    }

    function checkHorizontal(x){
      const result = new Set(g[x]);
      announceWin(result);
    }

    function checkVertical(y){
      const result = new Set(g.map((x)=>x[y]));
      announceWin(result);
    }

    function announceWin(l){
      if (l.size == 1){
        if (l.has("X")){
          setTimeout(()=>{alert("X wins")}, 10);
          return;
        } else {
          setTimeout(()=>{alert("O wins")}, 10);
          return;
        }
      }
    }

    checkDiagonal1();
    checkDiagonal2();
    checkHorizontal(x);
    checkVertical(y);
  }

  handleOnClick(x, y){
    const g = this.state.grid
    if (this.state.active){
      if (g[x][y] == '+'){
        g[x][y] = this.state.player;
        this.setState({'grid':g});
        this.state.player = this.state.player == 'X' ? 'O':'X';
        this.checkWins(x, y);
    } else {
      alert('Please select an empty square!');
      }
    }
  }

  render(){
    const style = {
      margin:'auto',
      width: "auto",
      height:"auto",
      backgroundColor:'darkorange',
      color:'white',
      fontSize:"3em",
      tableLayout:'fixed',
    }
    const rows = this.state.grid.map((r, i) => {return (
      <tr key={"row_"+i}>
        {r.map((d, j) => {console.log('building'); return(
          <Square
            key={i+"_"+j}
            dims={this.dims}
            onClick={()=>{this.handleOnClick(i,j)}}
            contents={d=="+"?" ":d} />
              )
            }
          )
        }
        </tr>)
        }
      );
    return (
      <div style={{textAlign:"center"}}>
        <h1>Tic-Tac-React!</h1>
        <small>tic-tac-toe, written with <b>ReactJS</b>. Enjoy!</small>
        <p>Current Player: {this.state.player}</p>
        <table cellSpacing="0" id="table" style={style}>
          <tbody>
            {rows}
          </tbody>
        </table>
        <br />
        <button style={{margin:"auto"}} onClick={this.handleReset}>reset</button>
        <br /><br />
        <button onClick={()=>{this.state.dim==1?1:this.state.dim-=1;this.setState({dim:this.state.dim})}}>-</button>

            &nbsp;&nbsp;&nbsp;<span style={{color:'white'}}>{this.state.dim}</span>&nbsp;&nbsp;&nbsp;

        <button onClick={()=>{this.state.dim+=1;this.setState({dim:this.state.dim})}}>+</button>
        <br /><br/><br/>
      </div>
  )
  }
}