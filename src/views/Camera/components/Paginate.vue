<template>
  <div class="inline-flex items-end ml-auto paginator" v-if="numberOfPages > 1">
    <a @click="prevPage">
      <SmIcon name="chevron-left" size="l" />
    </a>
    <p class="paginate">
      <a @click="selectPage(l)" v-for="(l, i) in pages" :key="i">
        <span class="page-link" :class="{active: l == currentPage}">{{ l }}</span>
      </a>
    </p>
    <a @click="nextPage">
      <SmIcon name="chevron-right" size="l" />
    </a>
  </div>
</template>

<script>
// import Component from "../component_location"

export default {
  components: {},

  props: ['page', 'data', 'currentPage', 'numberOfPages'],

  data() {
    return {
      pagesToShow: 5,
    };
  },

  watch: {
    currentPage() {
      this.$emit('page-change', this.currentPage);
    },
  },

  methods: {
    selectPage(page) {
      this.$emit('page-change', page);
    },

    nextPage() {
      if (!this.visible){
        return
      }
      if (this.currentPage == this.numberOfPages) {
        this.$emit('page-change', 1);
      } else {
        this.$emit('page-change', this.currentPage + 1);
      }
    },

    prevPage() {
      if (!this.visible){
        return
      }
      if (this.currentPage == 1) {
        this.$emit('page-change', this.numberOfPages);
      } else {
        this.$emit('page-change', this.currentPage - 1);
      }
    },
  },

  computed: {
    visible() {
      return this.numberOfPages>1
    },
    pages() {
      var pages = [];
      if (this.numberOfPages <= this.pagesToShow) {
        for (var k = 0; k < this.numberOfPages; k++) {
          pages.push(k + 1);
        }
      } else {
        var cP = this.currentPage;
        var nP = this.numberOfPages;
        pages.push(1);
        if (cP < 4) {
          pages.push(...[2, 3, 4]);
          pages.push('...');
          pages.push(nP);
        } else if (cP < nP - 2) {
          pages.push('...');
          pages.push(...[cP - 1, cP, cP + 1]);
          pages.push('...');
          pages.push(10);
        } else {
          pages.push('...');
          pages.push(...[nP - 3, nP - 2, nP - 1, nP]);
        }
      }
      return pages;
    },
  },

  mounted() {
    window.addEventListener('keydown', e => {
      if (e.keyCode == 39) {
        // RIGHT ARROW 
        this.nextPage();
      } else if (e.keyCode == 37) {
        // LEFT ARROW 
        this.prevPage();
      }
    });
  },
};
</script>

<style>
.paginate {
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 2px;
}
.page-link {
  padding-left: 5px;
  padding-right: 5px;
}
.page-link {
  color: black;
}
.active {
  color: blue;
  font-weight: bold;
}
.paginator {
  margin-left: -200px;
}
</style>
