<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row q-col-gutter-md items-end">
        <div class="col">
          <q-input bottom-slots class="new-qweet" v-model="newQweetContent" autogrow placeholder="What's happening!"
            counter maxlength="280">
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://i.ibb.co/h2Hy5VH/Screenshot-2021-03-18-151815.png">
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn @click="addNewQweet" color="primary" class="q-mb-lg" label=" Qweet" rounded unelevated no-caps :disable=!newQweetContent></q-btn>
        </div>
      </div>

      <q-separator size="10px" color="grey-2" class="divider"/>

      <q-list separator>
        <transition-group appear enter-active-class="animated fadeIn slower" leave-active-class="animated fadeOut slower">
          <q-item v-for="qweet in qweets" :key="qweet.id" class="q-py-md qweet">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://i.ibb.co/h2Hy5VH/Screenshot-2021-03-18-151815.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Satria Budi</strong>
                <span class="text-grey-7">
                  @satriabudiapri
                  <br class="lt-md">&bull; {{qweet.date | niceDate}}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body1">
                {{ qweet.content }}
              </q-item-label>
              <div class="qweet-icons row justify-between q-mt-sm">
                {{qweet.likes}}
                <q-btn color="grey" flat round size="sm" icon="far fa-comment" />
                <q-btn color="grey" flat round size="sm" icon="fas fa-retweet" />
                <q-btn :color="qweet.liked ? 'red' : 'grey'" @click="toggleLiked(qweet)" flat round size="sm" :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart' " />
                <q-btn color="grey" @click="deleteQweet(qweet)" flat round size="sm" icon="fas fa-trash" />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import moment from 'moment'

export default {
  name: 'PageHome',
  data() {
    return {
      newQweetContent: '',
      qweets: []
    }
  },
   filters: {
      niceDate(value) {
        return moment(value).fromNow()
      }
  },
  methods: {
    addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false
      }
      db.collection('qweets').add(newQweet)
        .then((docRef) => {
          this.newQweetContent = ''
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    },
    deleteQweet(qweet) {
      db.collection('qweets').doc(qweet.id).delete().then(() => {
        console.log('Document successfully deleted!');
      }).catch((error) => {
        console.error('Error removing document: ', error);
      });
    },
    toggleLiked(qweet) {
      db.collection('qweets').doc(qweet.id).update({
          liked: !qweet.liked
        })
        .then(() => {
          console.log('Document successfully updated!');
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error('Error updating document: ', error);
        });
    }
  },
  mounted() {
    db.collection('qweets').orderBy('date').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          let qweetChange = change.doc.data()
          qweetChange.id = change.doc.id
            if (change.type === 'added') {
                this.qweets.unshift(qweetChange)
            }
            if (change.type === 'modified') {
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
                Object.assign(this.qweets[index], qweetChange)
            }
            if (change.type === 'removed') {
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
                this.qweets.splice(index, 1)
            }
        });
    });
  }
}
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet:not(:first-child)
  border-top : 1px solid rgba(0, 0, 0, 0.12)
.qweet-content
  white-space: pre-line
.qweet-icons
 margin-left: -5px
</style>
