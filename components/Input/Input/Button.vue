<template>
  <button :class="'input button-' + $mq"><slot></slot></button>
</template>
<style >
button {
  border: 2px solid black;
  transition: 0.3s;
  padding: 10px 14px;
  margin: 4px;
  letter-spacing: 4px;
  font-size: 1em;
  z-index: 20;
  cursor: pointer;
  border-radius: 4px;
  color: black;
}

button {
  text-transform: uppercase;
}

button:hover {
  background-color: black;
  color: white;
}

.button-mobile {
  font-size: 1em;
  margin: 2px;
  padding: 8px 12px;
}
</style>
