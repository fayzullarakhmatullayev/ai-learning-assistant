const AppLayout = () => {
  const onChange = (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('title', e.target.files[0].name);

    const options = {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGMyYjg3MzU3NzllNWM2MjY4MDU2MSIsImlhdCI6MTc3MDgwMzMzNiwiZXhwIjoxNzcxNDA4MTM2fQ.Sd8NOiH2lWdLyKvNhLqKObEZ6lH05187ZVFD5VV7MXE'
      },
      body: formData
    };

    fetch('http://localhost:8000/api/documents/upload', options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>AppLayout</h1>
      <input type="file" accept="application/pdf" onChange={onChange} />
    </div>
  );
};

export default AppLayout;
