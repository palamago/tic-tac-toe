<?php
session_start();
error_reporting(2);

/*API*/
class GameRequest
{
    function __construct($params) {
    	$this->default_moves = array(
    		 '00' => array(0,0)
    		,'01' => array(0,1)
    		,'02' => array(0,2)
    		,'10' => array(1,0)
    		,'11' => array(1,1)
    		,'12' => array(1,2)
    		,'20' => array(2,0)
    		,'21' => array(2,1)
    		,'22' => array(2,2)
    		);
    	$this->action = $params['action'];
	   	$this->position = $params['position'];
	   	$this->success = false;
   	}

   	function run(){
   		if($this->action == 'clear'){
   			$this->_clear();
   		} else if($this->action == 'move') {
   			$this->_saveMove($this->position);
   			$this->_pickRandomMove();
   		}
   	}	

   	function _saveMove($position){
   		unset($_SESSION['moves'][$position[0].$position[1]]);
   	}	

   	function _clear(){
   		$_SESSION['moves'] = $this->default_moves;
   		$this->success = true;
   	}	

   	function _pickRandomMove(){
   		$randomMove = $_SESSION['moves'][array_rand($_SESSION['moves'],1)];
   		$this->cpuMove = $randomMove;
   		$this->_saveMove($randomMove);
   		$this->success = true;
   	}	

   	function render(){
   		$resp = array(
   			'position' => $this->cpuMove,
   			'success' => $this->success,
   			'moves' => $_SESSION['moves']
   			);
   		return $resp;
   	}
}

$gameRequest = new GameRequest($_POST);

$gameRequest->run();

echo json_encode($gameRequest->render());