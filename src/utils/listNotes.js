export const listNotes = (notes) => {
    notes.forEach(({ id, tags, content }) => {
        console.log('id: ', id);
        console.log('note: ', content);
        console.log('tags: ', tags);
        console.log('\n');
    });
};
