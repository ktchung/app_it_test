import React from 'react';
import Toast from 'react-bootstrap/Toast';

const RankToast = ({show, rank}) => {
  return (
    <Toast
      onClose={() => {}}
      show={show}
      className="rankToast"
    >
      <Toast.Header closeButton={false} className="mr-auto">
        <strong>Your Rank:</strong>
      </Toast.Header>
      <Toast.Body>
        {rank}
      </Toast.Body>
    </Toast>
  );
}

export default RankToast;