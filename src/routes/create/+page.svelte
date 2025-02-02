<script>
    import { goto } from "$app/navigation";

    let subject = '';
    let content = '';
    let message = '';

    const createQuestion = async (event) => {
        if (!subject || !content) {
            message = '제목과 내용은 필수입니다.';
            return;
        }

        const res = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ subject, content })
        });

        const data = await res.json();

        if (!res.ok) {
            message = data.message || '등록 실패';
        } else {
            message = `등록 성공! (id: ${data.questionId})`;
            subject = '';
            content = '';
            goto('/');
        }
    }
</script>

<div class="container">
    <h5 class="my-3 border-bottom pb-2">질문 등록</h5>
    <p>{message}</p>
    <form class="my-3">
        <div class="mb-3">
            <label for="subject">제목</label>
            <input type="text" class="form-control" bind:value="{subject}">
        </div>
        <div class="mb-3">
            <label for="content">내용</label>
            <textarea class="form-control" rows="10" bind:value="{content}"></textarea>
        </div>
        <button class="btn btn-primary" on:click="{createQuestion}">저장하기</button>
    </form>
</div>
