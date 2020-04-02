<template>
  <div class="SmDropdown">
    <div
      v-if="value"
      :class="{highlightSelection: expanded}"
      class="selectionClass"
      @click="expanded = !expanded"
    >
      <div class="dot" :style="{background: 'blue'}"></div>
      {{ value.common_name }} &nbsp; (<em>{{ value.scientific_name }}</em>)
      <SmIcon
        class="SmDropdownChevron"
        :class="{chevronRotate: expanded}"
        name="chevron-down"
      />
    </div>
    <div
      v-else
      :class="{highlightSelection: expanded}"
      class="selectionClass"
      @click="expanded = !expanded"
    >
      <div class="dot" :style="{background: 'blue'}"></div>
      Please Select a Target
      <SmIcon
        class="SmDropdownChevron"
        :class="{chevronRotate: expanded}"
        name="chevron-down"
      />
    </div>
    <div v-if="expanded" class="SmDropdownList">
      <div class="SmSearch">
        <SmSearch v-model="results" :targets="targets" />
      </div>
      <div class="results">
        <div
          v-for="(result, index) in results"
          :key="index"
          class="resultClass"
          @click="selectTarget(result)"
        >
          <div class="dot" :style="{background: 'red'}"></div>
          {{ result.common_name }} (<em>{{ result.scientific_name }}</em>)
        </div>
        <div v-if="results.length == 0" class="noResult">{{ resultsMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {searchTargets} from '../api/api.js';
import {getAllTargets} from '../api/api.js';

export default {
  name: 'TargetSelect',
  data: function() {
    return {
      resultsMessage: 'No Results',
      expanded: false,
      results: [],
      targets: [],
    };
  },
  props: {
    value: {
      type: Object,
    },
  },
  methods: {
    selectTarget(result) {
      this.$emit('input', result);
      this.expanded = false;
    },
    formatColor(target) {
      return '#af3aaa';
    },
  },
  created: function() {

    function debounce(callback, wait) {
      let timeout;
      return (...args) => {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(context, args), wait);
      };
    }

    window.addEventListener(
      'keyup',
      debounce(() => {
        console.log('Sending API call.');
        var searchText = d3.select('input.SmSearch').property('value');
        this.resultsMessage = 'Searching Database. Please Wait...'
        searchTargets(searchText).then(res => {
          console.log('Searched for ' + searchText + '.');
          console.log(this.targets.length);
          if (res.data.length > 0) {
            this.targets = res.data;
            this.results = res.data;
          }
          this.resultsMessage = 'No Results'  // now it is not targets fault
        });
        d3.select('input.SmSearch').dispatch('keyup');
      }, 750),
    );

  },
};
</script>

<style scoped>
.SmDropdown {
  position: relative;
  width: 600px;
  position: absolute;
  right: 0px;
  top: -10px;
}
.SmDropdownList {
  box-shadow: 0 0 0 1px var(--secondary);
  border-radius: 0px 0px 2px 2px;
  color: black;
  background: white;
  margin-top: -2px;
  position: absolute;
  width: 100%;
  z-index: 9998;
}
.selectionClass {
  border: 1px solid var(--secondary);
  color: black;
  background: white;
  position: relative;
  padding: 8px 16px;
  user-select: none;
  display: flex;
  align-items: center;
}
.highlightSelection {
  border: 1px solid var(--primary-hover);
  box-shadow: 0 0 0 1px var(--primary-hover);
  z-index: 9999;
}
.SmDropdownChevron {
  position: relative;
  float: right;
  margin-top: 2px;
  margin-left: auto;
}
.chevronRotate {
  transform: rotate(180deg);
}
.SmSearch {
  position: relative;
  margin: 0px 12px;
  padding: 14px 4px 12px 4px;
  border-bottom: 1px solid black;
  border-radius: 0px;
}
.results {
  padding: 8px 0px;
  overflow: scroll;
  max-height: 176px;
}
.resultClass {
  padding: 4px 16px;
  border-radius: 0px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
}
.resultClass:hover {
  background: var(--primary-hover);
  color: white;
}
.noResult {
  color: grey;
  text-align: center;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 100%;
  margin: 0 8px 0 0;
}
</style>
