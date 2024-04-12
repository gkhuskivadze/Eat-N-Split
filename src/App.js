import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    names: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    names: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    names: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [newFriend, setNewFriend] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setIsOpen(false);
  }
  function handleAddNewFriend(friend) {
    setNewFriend((friends) => [...friends, friend]);
  }

  function handleToggleAddFriend() {
    setIsOpen((open) => !open);
  }

  function handleSplitUpdate() {}
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          newFriend={newFriend}
          onSetNewFriend={setNewFriend}
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {isOpen && (
          <FormAddFriend
            newFriend={newFriend}
            onSetNewFriend={setNewFriend}
            onHandleAddNewFriend={handleAddNewFriend}
          />
        )}
        <Button onClick={handleToggleAddFriend}>
          {isOpen ? "Close" : "Add a friend"}
        </Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
    </div>
  );
}

function FriendsList({ newFriend, onSelection, selectedFriend }) {
  const friends = newFriend;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const selected = selectedFriend?.id === friend.id;
  return (
    <li>
      <img src={friend.image} />
      <h3>{friend.names}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.names} {friend.balance}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.names} owes you {friend.balance}
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.names} are even</p>
      )}

      <Button onClick={(e) => onSelection(friend)}>
        {selected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ newFriend, onSetNewFriend, onHandleAddNewFriend }) {
  const [names, setNamesValue] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleAddFriend(e) {
    e.preventDefault();
    if (!names || !image) return;
    const id = crypto.randomUUID();
    const newFriend = { names, image: `${image}?=${id}`, id, balance: 0 };
    onHandleAddNewFriend(newFriend);
    setNamesValue("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>Friend name</label>
      <input
        type="text"
        value={names}
        onChange={(e) => setNamesValue(e.target.value)}
      />
      <label>Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormSplitBill({ selectedFriend }) {
  const [bill, setBill] = useState("");
  const [userExpenses, setUserExpenses] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("");

  const friendsExpenses = bill ? bill - userExpenses : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userExpenses) return;
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend?.names}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your expenses</label>
      <input
        type="text"
        value={userExpenses}
        onChange={(e) =>
          setUserExpenses(
            Number(e.target.value) > bill
              ? userExpenses
              : Number(e.target.value)
          )
        }
      />
      <label>{selectedFriend?.names} Expenses</label>
      <input type="text" disabled value={friendsExpenses} />
      <label>Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend?.names}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
