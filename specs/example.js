module.exports = {
    animal: {
      groups: [
        {
          tags: [['class', 'mammal']],
          phrases: ['dog', 'cat']
        },
        {
          tags: [['class', 'bird']],
          phrases: ['parrot']
        }
      ]
    },
    root: {
      groups: [
        {
          tags: [],
          phrases: [
            "[name]: I have a [:animal] who is [#2-7] years old."
          ]
        }
      ]
    }
  };