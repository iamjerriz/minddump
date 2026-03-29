const LOVE_POSTS = [
  "I still think about the way you laughed that night.",
  "You made me believe in second chances.",
  "I never told you, but you were the best part of my day.",
  "Some people come into your life and change everything.",
  "I fell in love with your mind before anything else.",
  "Missing someone is the heart's way of reminding you that you loved.",
  "You are the poem I never knew how to write.",
  "I hope you find someone who loves your weird the way I did.",
  "The way you looked at me made me feel infinite.",
  "Love isn't perfect. But it's worth it.",
  "I wrote your name in the stars and watched them burn for you.",
  "You taught me what it means to be vulnerable.",
  "I don't regret loving you. I regret not telling you sooner.",
  "Every love song suddenly made sense when I met you.",
  "Your voice is my favorite sound in this whole world.",
  "I keep our memories in a place where nothing can touch them.",
  "Love is staying even when it's easier to leave.",
  "You're the reason I started believing in forever.",
  "I loved you in silence and that was my loudest mistake.",
  "Some hearts understand each other without a single word.",
  "You were the first person who made me feel like enough.",
  "I'd choose you in every lifetime, no question.",
  "The hardest part was pretending I didn't care.",
  "You showed me that love doesn't have to hurt.",
  "I still smile when I think about us.",
  "Loving you was the easiest thing I've ever done.",
  "I didn't lose you. You were never mine. But I loved you anyway.",
  "Your hand in mine was the safest place I've ever known.",
  "I think about you more than you'll ever know.",
  "We were a beautiful almost.",
  "I fell for you the way the leaves fall — slowly, then all at once.",
  "You're my 3am thought and my 7am smile.",
  "Love isn't always grand gestures. Sometimes it's just showing up.",
  "I keep looking for you in everyone I meet.",
  "You were the plot twist I never saw coming.",
  "If love is a language, you taught me fluency.",
  "I hope wherever you are, someone is loving you right.",
  "You didn't just touch my heart. You rearranged it.",
  "I never believed in soulmates until you proved me wrong.",
  "The best thing about loving you? I became a better me.",
  "I carry you with me in every quiet moment.",
  "Some connections don't need Wi-Fi. They just click.",
  "You're the person I want to annoy for the rest of my life.",
  "Love found me when I stopped looking.",
  "I'd rather fight with you than love anyone else.",
  "You're my favorite notification.",
  "I love you not for who you are but for who I am when I'm with you.",
  "The spaces between your fingers were made for mine.",
  "You're my calm in all this chaos.",
  "I loved you before I even knew what love was.",
  "Every heartbeat says your name.",
  "You're the reason I look forward to tomorrow.",
  "I want to be your last everything.",
  "If I had to choose again, I'd still choose you.",
  "Love is watching someone grow and cheering the loudest.",
  "You turned my world into color.",
  "I'm not perfect but I'm perfectly yours.",
  "I didn't plan on falling for you. But here we are.",
  "You're the home I always wanted to come back to.",
  "Your imperfections are what make you perfect to me.",
  "I've loved you since the moment you made me laugh.",
  "You are my today and all of my tomorrows.",
  "I found paradise in your eyes.",
  "You make the ordinary feel extraordinary.",
  "I love you more than yesterday but less than tomorrow.",
  "Falling in love with you was like coming home.",
  "You're the missing piece I didn't know I needed.",
  "I wrote this because I couldn't say it to your face.",
  "Every sunset reminds me of you.",
  "You're my favorite chapter in this messy story.",
  "I love you in ways words will never capture.",
  "You make my heart do stupid things.",
  "I choose you. And I'll keep choosing you.",
  "You're the warmth in my winter.",
  "I love you to the moon and back. And then some.",
  "You're the one who makes sense in a senseless world.",
  "My heart recognized you before my mind caught up.",
  "I miss the way your eyes smiled before your lips did.",
  "Loving you quietly was the hardest love I've ever given.",
  "You're the first thing I think of and the last thing I dream of.",
  "I didn't know love until you showed me.",
  "You're the magnet my compass always points to.",
  "I love your chaos. All of it.",
  "Some people feel like home. You feel like Sunday morning.",
  "You loved me when I couldn't love myself.",
  "I'd walk through fire just to hold your hand.",
  "You're the art I never want to stop staring at.",
  "I love you more than coffee. And that says a lot.",
  "You're the plot of every love story I've ever wanted.",
  "I didn't believe in magic until you walked into my life.",
  "You are every love song I've ever heard.",
  "Distance means nothing when someone means everything.",
  "I carry your heart with me. Always.",
  "You're the most beautiful disaster I've ever loved.",
  "I love the way you love the things you love.",
  "You're my 11:11 wish every single time.",
  "Wherever you go, my heart follows.",
  "I loved you at your worst and I'll love you at your best.",
  "You're the sweetest chaos I've ever known.",
  "I love you. There. I finally said it.",
]

const NAMES = [
  "luna", "kai", "nova", "atlas", "sage", "river", "ash", "ember",
  "sky", "rain", "phoenix", "storm", "willow", "jade", "leo",
  "aria", "zion", "cleo", "milo", "iris", "felix", "maya",
  "nico", "stella", "rex", "violet", "dante", "aurora", "ezra", "ivy",
]

function randomDate() {
  const now = Date.now()
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  return new Date(thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo)).toISOString()
}

function randomId() {
  return crypto.randomUUID?.() ||
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
}

export function generateSamplePosts(category = 'love', count = 100) {
  const posts = LOVE_POSTS.slice(0, count)
  return posts.map((content) => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)]
    return {
      id: randomId(),
      user_id: randomId(),
      username: name,
      avatar_url: '',
      category,
      content,
      color: 'indigo',
      created_at: randomDate(),
    }
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}
