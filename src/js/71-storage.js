  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ STORAGE / DRAGGABLE WINDOWS / NOTEPAD                                       │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function storageAdapter(options = {}) {

    const get =
      options.get ||
      (
        async (
          key,
          fallback = null
        ) => fallback
      );

    const set =
      options.set ||
      (
        async () => {}
      );

    const remove =
      options.remove ||
      options.delete ||
      (
        async () => {}
      );

    return Object.freeze({

      async get(
        key,
        fallback = null
      ) {

        const value =
          await Promise.resolve(
            get(
              key,
              fallback
            )
          );

        return value == null
          ? fallback
          : value;

      },

      async set(
        key,
        value
      ) {

        return Promise.resolve(
          set(
            key,
            value
          )
        );

      },

      async remove(key) {

        return Promise.resolve(
          remove(key)
        );

      }

    });

  }
