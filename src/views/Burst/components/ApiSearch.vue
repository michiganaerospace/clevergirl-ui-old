<template>
  <div id="SmSearchDiv">
    <input
      type="search"
      class="SmSearch"
      v-model="filter"
      placeholder="Search"
      @keyup="filterResults"
    />
  </div>
</template>

<script>
// import SmIcon from "./SmIcon.vue";
import * as Fuse from "fuse.js";
export default {
  name: "SmSearch",
  props: {
    targets: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      results: [],
      filter: ""
    };
  },
  computed: {
    options: function() {
      // Check if targets is a list of strings or dictionaries to set correct keys.
      let keys =
        typeof this.targets[0] == "string" ? [] : Object.keys(this.targets[0]);
      return {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: keys
      };
    },
    fuse: function() {
      return new Fuse(this.targets, this.options);
    }
  },
  methods: {
    filterResults() {
      // If filter is empty, return all results
      if (this.filter == "") {
        this.results = this.targets;
      } else {
        this.results = this.fuse.search(this.filter);
        // If list is a string, access indexed values.
        if (typeof this.targets[0] == "string") {
          for (var i = 0; i < this.results.length; i++) {
            this.results[i] = this.targets[this.results[i]];
          }
        }
      }
      this.$emit("input", this.results);
    }
  }
};
</script>

<style scoped>
.SmSearch {
  position: relative;
  width: 100%;
}
</style>
