<script>
    import { page } from "$app/state";
</script>

<h1>에러 발생!</h1>
<!-- <p>메시지: {params.message}</p>
<p>코드: {params.code}</p>
<p>상태: {params.status}</p> -->
<p>{page.error.message}</p>