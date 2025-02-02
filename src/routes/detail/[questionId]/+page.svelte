<script>
    import { page } from '$app/state';
    import ErrorMessage from '../../../components/ErrorMessage.svelte';

    const params = page.params;
    let questionId = params.questionId;

    let props = $props();
    let question = $state(props.data.question);
    let content = $state();
    let message = $state();

    const getQuestion = async () => {
        const res = await fetch(`/api/questions/${questionId}/answers`);
        question.answers = await res.json();
    }

    const createAnswer = async (event) => {
        try {
            event.preventDefault();
            if (!content) {
                message = '답변 내용을 작성해주세요.';
                return;
            }

            const res = await fetch(`/api/questions/${questionId}/answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });

            const data = await res.json();

            if (!res.ok) {
                message = data.message || '등록 실패';
            } else {
                message = `등록 성공! (id: ${data.answerId})`;
                content = '';
                getQuestion();
            }
        } catch (err) {
            message = err;
        }
    }
</script>

<div class="container my-3">
    <!-- 질문 -->
    <h2 class="border-bottom py-2">{question.subject}</h2>
    <div class=card my-3>
        <div class="card-body">
            <div class="card-text" style="white-space: pre-line;">{question.content}</div>
            <div class="d-flex justify-content-end">
                <div class="badge bg-light text-dark p-2">{question.createdAt}</div>
            </div>
        </div>
    </div>
    <!-- 답변 목록 -->
    <h5 class="border-bottom my-3 py-2">{question.answers?.length ?? '0'}개의 답변이 있습니다.</h5>
    {#each question.answers as answer}
        <div class="card my-3">
            <div class="card-body">
                <div class="card-text" style="white-space: pre-linel">{answer.content}</div>
                <div class="d-flex justify-content-end">
                    <div class="badge bg-light text-dark p-2">{answer.createdAt}</div>
                </div>
            </div>
        </div>
    {/each}
    <!-- 답변 등록 -->
    <p>{message}</p>
    <form method="post" class="my-3">
        <div class="mb-3">
            <textarea rows="10" bind:value={content} class="form-control"></textarea>
        </div>
        <input type="submit" value="답변등록" class="btn btn-primary" onclick="{createAnswer}" />
    </form>
</div>